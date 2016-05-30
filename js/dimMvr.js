      Private Sub PCode_AfterUpdate()
         If IsEmpty(mvarZip) Then Exit Sub
         If Len(mvarZip) = 6 Then
            Screen.ActiveControl = Left(mvarZip, Len(mvarZip)-1)
         Else
            Screen.ActiveControl = Format(mvarZip, "@@@@@-@@@@")
         End If
         mvarZip = Empty
      End Sub

      Private Sub PCode_BeforeUpdate(Cancel As Integer)
         Dim ctlZip As Control
         Dim strTitle As String
         Dim strMsg As String
         Const cYesNoButtons = 4
         Const cNoChosen = 7

         mvarZip = Empty
         Set ctlZip = Screen.ActiveControl

         If ctlZip Like "#####-####" Or ctlZip Like "#####" Then
            Exit Sub
         ElseIf ctlZip Like "#########" Or ctlZip Like "#####-" Then
            mvarZip = ctlZip
         Else
            strTitle = "Not a ZIP Code."
            strMsg = "Save as entered?"
            If MsgBox(strMsg, cYesNoButtons, strTitle) = cNoChosen Then
               Cancel = True
            End If
         End If
      End Sub
